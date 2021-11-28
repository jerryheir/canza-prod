import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './issue.entity';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async createIssue(object: any) {
    await this.issueRepository.save(object);
  }

  async getMyIssue(object: any) {
    return await this.issueRepository.find(object);
  }

  async getAllIssue() {
    return await this.issueRepository.find();
  }

  async updateIssue(i: any, object: any) {
    return await this.issueRepository.update(i, object);
  }
}
