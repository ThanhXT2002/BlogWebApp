import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { IComment } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment/comment.service';
import { BreadcrumbComponent } from "../layout/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [BreadcrumbComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputSwitchModule
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  breadcrumbTitle: string = 'Quản Lý Bình Luận';
  comments: IComment[] = [];
  originalComments: IComment[] = [];
  private searchTerms = new Subject<string>();
  searchValue: string = '';


  constructor(
    private commentService: CommentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadAllComments();

  }

  loadAllComments() {
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        const sortedComments = comments.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        this.comments = sortedComments;
        this.originalComments = [...sortedComments];
      },
      error: (error) => {
        console.error('Error fetching comments', error);
        this.toastr.error('Không thể tải comments', 'Lỗi');
      }
    });
  }

  deleteComment(key: string) {
    if (confirm('Bạn có chắc chắn muốn xóa comment này?')) {
      this.commentService.deleteComment(key).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment.key !== key);
          this.originalComments = this.originalComments.filter(comment => comment.key !== key);
          this.searchComments(); // Reapply search if needed
          this.toastr.success('Comment đã được xóa thành công', 'Thành công');
        },
        error: (error) => {
          console.error('Error deleting comment', error);
          this.toastr.error('Không thể xóa comment', 'Lỗi');
        }
      });
    }
  }



  searchComments() {
    const searchTerm = this.searchValue?.toLowerCase().trim();

    if (!searchTerm) {
      // Nếu searchValue trống, hiển thị tất cả comments
      this.comments = [...this.originalComments];
      return;
    }

    // Lọc comments theo từ khóa tìm kiếm
    this.comments = this.originalComments.filter(comment =>
      (comment.content?.toLowerCase() ?? '').includes(searchTerm) ||
      (comment.user_name?.toLowerCase() ?? '').includes(searchTerm)
    );
  }

  updateCommentStatus(comment: IComment) {
    this.commentService.updateComment(comment.key!, { status: comment.status }).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái comment thành công', 'Thành công');
      },
      error: (error) => {
        console.error('Error updating comment status', error);
        this.toastr.error('Không thể cập nhật trạng thái comment', 'Lỗi');
        // Revert the change in the local array if the API call fails
        comment.status = !comment.status;
      }
    });
  }


}
