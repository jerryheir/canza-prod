import { responseData } from '../interfaces';
import { IssueDto } from './dto/issue.dto';
import { IssueService } from './issue.service';
import { Request } from 'express';
export declare class IssueController {
    private readonly issueService;
    constructor(issueService: IssueService);
    sendCoin(request: Request, issueDto: IssueDto): Promise<responseData>;
    updateIssue(request: Request, id: string, issueDto: any): Promise<responseData>;
    getIssue(request: Request): Promise<responseData>;
    getAllIssue(request: Request): Promise<responseData>;
}
