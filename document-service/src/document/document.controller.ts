import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  Delete,
  UseGuards,
  UploadedFiles,
  Req,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly authService: AuthService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin', 'editor', 'viewer') 
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFilesuploadFiles(
    @UploadedFiles() filesObject: { files: Array<Express.Multer.File> },
    @Req() req: Request,
  ) {
    if (!filesObject.files) {
      throw new Error('No files uploaded');
    }

    await this.documentService.createUploadsFolder();
    const username = await this.authService.getCurrentUser(req);

    const documents = await Promise.all(
      filesObject.files.map(async (file) => {
        return await this.documentService.saveDocument(file, username);
      }),
    );

    return {
      message: 'Files uploaded successfully',

      documents,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor', 'viewer')
  async getAllDocuments(@Req() req: Request) {
    return this.documentService.getAllDocuments(req['user']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor', 'viewer') 
  async getDocumentById(@Param('id') id: string) {
    return await this.documentService.getDocumentById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  async updateDocument(
    @Param('id') id: string,
    @Body('newName') newName: string,
  ) {
    return await this.documentService.updateDocument(id, newName);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete documents
  async deleteDocument(@Param('id') id: string) {
    const result =  await this.documentService.deleteDocument(id);
    if(result === true)
    {
      return 'Doc Deleted succesully';
    }
    return new InternalServerErrorException('Doc could not be deleted');
  }
}
