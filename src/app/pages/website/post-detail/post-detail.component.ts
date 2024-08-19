// post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post/post.service';
import { SliderComponent } from "../slider/slider.component";
import { SanitizeHtmlPipe } from '../../../core/pipe/sanitize-html.pipe';
import { FormsModule } from '@angular/forms';
import { IComment } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment/comment.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../core/models/user.model';


@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    SanitizeHtmlPipe,
    FormsModule
],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',

})
export class PostDetailComponent implements OnInit{
  post: IPost | null = null;
  comments: IComment[] = [];
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        if (post && post.key) {
          this.loadComments(post.key);
        }
      },
      error: (error) => {
        console.error('Error loading post:', error);
      }
    });
  }

  loadComments(postId: string) {
  this.commentService.getCommentsByPostId(postId).subscribe({
    next: (comments) => {
      // Lọc chỉ lấy các comment có status là true
      this.comments = comments.filter(comment => comment.status === true);

      // Sắp xếp các comment theo thời gian tạo mới nhất (nếu cần)
      this.comments.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    error: (error) => {
      console.error('Error loading comments:', error);
    }
  });
}

  addComment() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      this.toastr.warning('Bạn cần đăng nhập để bình luận', 'Cảnh báo');
      return;
    }

    const user: IUser = JSON.parse(userString);
    const userId = user.key;
    const userName = user.name;
    const userImage = user.image;

    if (!userId) {
      this.toastr.warning('Không thể xác định người dùng, vui lòng đăng nhập lại', 'Cảnh báo');
      return;
    }

    if (!this.post || !this.post.key) {
      this.toastr.error('Không thể thêm bình luận cho bài viết này', 'Lỗi');
      return;
    }

    if (this.newComment.trim()) {
      this.commentService.createComment({
        post_id: this.post.key,
        user_id: userId,
        user_name: userName,
        user_image: userImage,
        content: this.newComment
      }).subscribe({
        next: () => {
          this.newComment = '';
          this.toastr.success('Bình luận đã được thêm thành công', 'Thành công');
          // Cập nhật số lượng comment và tải lại comments nếu cần
          if (this.post && this.post.key) {
            this.loadComments(this.post.key);
          }
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          this.toastr.error('Có lỗi xảy ra khi thêm bình luận', 'Lỗi');
        }
      });
    } else {
      this.toastr.warning('Nội dung bình luận không được để trống', 'Cảnh báo');
    }
  }
}
