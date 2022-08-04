import { Comment } from 'src/common/models/comment.model';

export class GetCommentsDto {
  comments: Comment[];
  totalCount: number;
}

export class GetCommentsWithReplyDto {
  comments: any[];
  totalCount: number;
}
