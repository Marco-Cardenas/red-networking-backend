import { Module } from '@nestjs/common';
import { ProcesosService } from './procesos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../BD/schemas/users.schema';
import { RatingSchema } from '../BD/schemas/ratings.schema';
import { RankingSchema } from '../BD/schemas/rankings.schema';
import { ProjectSchema } from '../BD/schemas/projects.schema';
import { CommentSchema } from '../BD/schemas/comments.schema';
import { BadgeSchema } from '../BD/schemas/badges.schema';
import { AIReviewSchema } from '../BD/schemas/ai_review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "users", schema: UserSchema },
      { name: "ratings", schema: RatingSchema },
      { name: "rankings", schema: RankingSchema },
      { name: "projects", schema: ProjectSchema },
      { name: "comments", schema: CommentSchema },
      { name: "badges", schema: BadgeSchema },
      { name: "aireviews", schema: AIReviewSchema }
    ])
  ],
  providers: [ProcesosService],
  exports: [ProcesosService]
})
export class ProcesosModule {}
