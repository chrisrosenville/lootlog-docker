import { Test, TestingModule } from '@nestjs/testing';
import { ArticleStatusesService } from './article-statuses.service';

describe('ArticleStatusesService', () => {
  let service: ArticleStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleStatusesService],
    }).compile();

    service = module.get<ArticleStatusesService>(ArticleStatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
