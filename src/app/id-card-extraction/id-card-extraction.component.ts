import { Component, OnInit } from '@angular/core';
import { IdCardService, IDCardData } from '../services/id-card.service';

@Component({
  selector: 'app-id-card-extraction',
  templateUrl: './id-card-extraction.component.html',
  styleUrls: ['./id-card-extraction.component.css'],
})
export class IdCardExtractionComponent implements OnInit {
  selectedImage: string | null = null;
  extractedData: IDCardData | null = null;
  errorMessage: string | null = null;
  video: HTMLVideoElement | null = null;

  constructor(private idCardService: IdCardService) {}

  ngOnInit() {
    this.video = document.createElement('video');
  }

  openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (this.video) {
          this.video.srcObject = stream;
          this.video.play();
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        this.errorMessage = "Erreur d'accès à la caméra.";
      });
  }

  captureImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (this.video) {
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      context?.drawImage(this.video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      this.selectedImage = imageData;
      this.extractTextFromImage(imageData);
    }
  }

  extractTextFromImage(image: string) {
    this.idCardService.extractTextFromImage(image)
      .then((text) => {
        console.log('Texte extrait:', text);
        this.extractedData = this.idCardService.parseExtractedData(text);
        this.errorMessage = null;
      })
      .catch((err) => {
        this.errorMessage = 'Erreur lors de l\'extraction des données : ' + err.message;
        this.extractedData = null;
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        this.selectedImage = typeof result === 'string' ? result : null;
      };
      reader.readAsDataURL(file);

      // Appeler le service pour traiter l'image
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.idCardService.uploadImage(file).subscribe({
      next: (response) => {
        this.extractedData = response;
        this.errorMessage = null;
      },
      error: (error) => {
        this.extractedData = null;
        this.errorMessage = error.error?.error || 'Erreur lors de l\'extraction des données.';
      },
    });
  }
}
