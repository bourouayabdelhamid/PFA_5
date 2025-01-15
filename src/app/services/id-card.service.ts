import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Tesseract from 'tesseract.js';

export interface IDCardData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  id_code: string;
}

@Injectable({
  providedIn: 'root',
})
export class IdCardService {
  private apiUrl = 'http://localhost:8080/api/process'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<IDCardData> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<IDCardData>(this.apiUrl, formData);
  }

  extractTextFromImage(image: string): Promise<string> {
    return Tesseract.recognize(image, 'eng', {
      logger: info => console.log(info),
    }).then(({ data: { text } }) => text);
  }

  parseExtractedData(text: string): IDCardData {
    const lines = text.split('\n');
    return {
      first_name: lines[0] || '',
      last_name: lines[1] || '',
      date_of_birth: lines[2] || '',
      place_of_birth: lines[3] || '',
      id_code: lines[4] || '',
    };
  }
}
