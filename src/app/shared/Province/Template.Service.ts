import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  api: any;
  constructor(
    private http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {
    this.api = this.Base.url;
  }
  CoreElements() {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_Core_Elements(),
      {
        responseType: 'json',
      }
    );
  }
  // POST: Save a new template
  saveTemplate(data: any) {
    return this.http.post(
      this.Base.url + this.ApiUrl.post_save_template(),
      data
    );
  }

  // GET: Get a specific template
  getTemplate(transId: any) {
    return this.http.get(this.Base.url + this.ApiUrl.get_template(transId));
  }
  // In your service (no argument needed)
  getAllTemplates() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_templates(), {
      responseType: 'json',
    });
  }

  // PUT or POST: Update an existing template
  updateTemplate(data: any) {
    return this.http.put(
      this.Base.url + this.ApiUrl.put_update_template(data.templateId),
      data
    );
  }

  // DELETE: Delete a template
  deleteTemplate(templateId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_template(templateId)
    );
  }
}
