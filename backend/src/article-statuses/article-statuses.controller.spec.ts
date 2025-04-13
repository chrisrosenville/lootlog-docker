import { Test, TestingModule } from '@nestjs/testing';
import { ArticleStatusesController } from './article-statuses.controller';

describe('ArticleStatusesController', () => {
  let controller: ArticleStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleStatusesController],
    }).compile();

    controller = module.get<ArticleStatusesController>(ArticleStatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
