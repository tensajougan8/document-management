import { User } from "../entities/user.entity";

export class CreateDocumentDto {
  id: string;

  originalname: string;

  fileName: string;

  mimetype: string;

  size: number;

  path: string;
  isDeleted: boolean;

  uploadedAt: Date;
}
