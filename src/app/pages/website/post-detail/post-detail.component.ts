// post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IPost } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post/post.service';
import { SliderComponent } from "../slider/slider.component";
import { SanitizeHtmlPipe } from '../../../core/pipe/sanitize-html.pipe';


@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    SanitizeHtmlPipe
],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',

})
export class PostDetailComponent implements OnInit{
  post: IPost | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
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
      },
      error: (error) => {
        console.error('Error loading post:', error);
      }
    });
  }
}
