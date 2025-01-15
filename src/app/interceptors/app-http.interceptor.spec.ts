import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AppHttpInterceptor } from './app-http.interceptor';
import { AuthService } from '../services/auth.service';

describe('AppHttpInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Mock d'AuthService avec un token simulé.
    authServiceSpy = jasmine.createSpyObj('AuthService', ['accessToken']);
    authServiceSpy.accessToken = 'test-token';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP non gérées.
  });

  it("devrait ajouter l'en-tête Authorization si un token existe", () => {
    httpClient.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it("ne devrait pas ajouter l'en-tête Authorization pour les requêtes vers /login", () => {
    httpClient.get('/login').subscribe();

    const httpRequest = httpMock.expectOne('/login');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });
});
