import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateDocumentDto } from './dto/create-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Document, Status } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}
  private readonly uploadPath = path.join(__dirname, '..', 'uploads');
  private documents: CreateDocumentDto[] = [];

  async createUploadsFolder() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creating upload folder', error);
    }
  }

  async saveDocument(
    file: Express.Multer.File,
    username: string,
  ): Promise<CreateDocumentDto> {
    const { originalname, mimetype, size } = file;
    const fileExtension = path.extname(originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    await fs.writeFile(path.join(this.uploadPath, fileName), file.buffer);
    const user = await this.usersRepository.findOne({ where: { username } });

    const document: Document = {
      id: uuidv4(),
      originalname,
      fileName,
      mimetype,
      size,
      user,
      ingestionStatus: Status.NEW_DOC,
      path: path.join(this.uploadPath, fileName),
      isDeleted: false,
      uploadedAt: new Date(),
    };

    const docObj = await this.documentRepository.create(document);
    await this.documentRepository.save(docObj);

    return document;
  }

  async getAllDocuments(user: any): Promise<CreateDocumentDto[]> {
    return await this.documentRepository.find({
      where: { user: { id: user.userId }, isDeleted: false },
    });
  }

 
  async getDocumentById(id: string): Promise<CreateDocumentDto | undefined> {
    return await this.documentRepository.findOneBy({ id, isDeleted: false });
  }

  async updateDocument(
    id: string,
    newName: string,
  ): Promise<CreateDocumentDto | null> {
    const document = await this.getDocumentById(id);

    if (!document) {
      throw new BadRequestException(`Document with ${id} does not exist`);
    }

    const oldPath = document.path;
    const newFileName = `${uuidv4()}${path.extname(document.originalname)}`;
    const newPath = path.join(this.uploadPath, newFileName);
    await fs.rename(oldPath, newPath);
    document.originalname = newName;
    document.fileName = newFileName;
    document.path = newPath;
    await this.documentRepository.save(document);

    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const document = await this.getDocumentById(id);

    if (!document) {
      throw new BadRequestException(`Document with ${id} does not exist`);
    }

    const path = document.path;
    await fs.unlink(path);
    await this.documentRepository.update(
      { id: document.id },
      { isDeleted: true },
    );
    return true;
  }
}
