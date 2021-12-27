import { Repository } from 'typeorm';
import { Issue } from './issue.entity';
export declare class IssueService {
    private readonly issueRepository;
    constructor(issueRepository: Repository<Issue>);
    createIssue(object: any): Promise<void>;
    getMyIssue(object: any): Promise<Issue[]>;
    getAllIssue(): Promise<Issue[]>;
    updateIssue(i: any, object: any): Promise<import("typeorm").UpdateResult>;
}
