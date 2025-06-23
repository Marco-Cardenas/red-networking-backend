import { Module } from '@nestjs/common';
import { ProcesosService } from './procesos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/BD/schemas/users.schema';
import { RatingSchema } from 'src/BD/schemas/ratings.schema';
import { RankingSchema } from 'src/BD/schemas/rankings.schema';
import { ProjectSchema } from 'src/BD/schemas/projects.schema';
import { CommentSchema } from 'src/BD/schemas/comments.schema';
import { BadgeSchema } from 'src/BD/schemas/badges.schema';
import { AIReviewSchema } from 'src/BD/schemas/ai_review.schema';

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
