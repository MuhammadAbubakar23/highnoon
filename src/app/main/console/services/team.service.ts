import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getTeams(pageNumber: number, pageSize: number, text: String): Observable<any> {
    return this.http.get(baseUrl + `Team/GetAllTeams?PageNumber=${pageNumber}&PageSize=${pageSize}&Text=${text}`)
  }

  getTeamById(teamId: any): Observable<any> {
    return this.http.get(baseUrl + `Team/GetTeamById/${teamId}`)
  }
  createTeam(data: any): Observable<any> {

    return this.http.post(baseUrl + "Team/AddTeam", data)
  }
  updateTeam(data: any): Observable<any> {

    return this.http.put(baseUrl + "Team/UpdateTeam", data)
  }
  deleteTeam(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Team/DeleteTeam/${id}`)
  }
  getApproversByTeamId(teamId: any): Observable<any> {
    return this.http.get(baseUrl + `Team/GetApproversByTeamId/${teamId}`)
  }
  addTeamApproves(data: any): Observable<any> {

    return this.http.post(baseUrl + "Team/AddTeamApproves", data)
  }
}

