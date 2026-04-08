export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  institutionName: string;
  ipfsHash: string;
  tokenId: string;
  recipientAddress: string;
}

export type UserRole = 'admin' | 'student' | 'public';
