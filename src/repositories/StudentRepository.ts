import { FirestoreService } from '@/services/FirestoreService';
import { StudentDocument } from '@/lib/schemas';

const COLLECTION = 'students';

export class StudentRepository {
  static async getStudent(uid: string): Promise<StudentDocument | null> {
    return await FirestoreService.getDocument<StudentDocument>(COLLECTION, uid);
  }

  static async getAllStudents(): Promise<StudentDocument[]> {
    return await FirestoreService.getDocuments<StudentDocument>(COLLECTION);
  }

  static async updateStudent(uid: string, data: Partial<StudentDocument>): Promise<void> {
    await FirestoreService.updateDocument<StudentDocument>(COLLECTION, uid, data);
  }

  static async deleteStudent(uid: string): Promise<void> {
    await FirestoreService.deleteDocument(COLLECTION, uid);
  }
}
