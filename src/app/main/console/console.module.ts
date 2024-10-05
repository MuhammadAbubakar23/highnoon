import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsoleRoutingModule } from './console-routing.module';
import { UsersComponent } from './components/users/users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { DesignationsComponent } from './components/designations/designations.component';
import { CreateDesignationComponent } from './components/create-designation/create-designation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CreateDepartmentComponent } from './components/create-department/create-department.component';
import { EmployeeTypeComponent } from './components/employee-type/employee-type.component';
import { CreateEmployeeTypeComponent } from './components/create-employee-type/create-employee-type.component';
import { LocationsComponent } from './components/locations/locations.component';
import { CreateLocationComponent } from './components/create-location/create-location.component';
import { TeamsComponent } from './components/teams/teams.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { CreateEmployeeComponent } from './components/create-employee/create-employee.component';
import { CountryComponent } from './components/country/country.component';
import { CreateCountryComponent } from './components/create-country/create-country.component';
import { StateComponent } from './components/state/state.component';
import { CreateStateComponent } from './components/create-state/create-state.component';
import { CityComponent } from './components/city/city.component';
import { CreateCityComponent } from './components/create-city/create-city.component';
import { EmployerComponent } from './components/employer/employer.component';
import { CreateEmployerComponent } from './components/create-employer/create-employer.component';
import { JobTitleComponent } from './components/job-title/job-title.component';
import { CreateJobTitleComponent } from './components/create-job-title/create-job-title.component';
import { LeaveStatusComponent } from './components/leave-status/leave-status.component';
import { CreateLeaveStatusComponent } from './components/create-leave-status/create-leave-status.component';
import { LeaveTypeComponent } from './components/leave-type/leave-type.component';
import { CreateLeaveTypeComponent } from './components/create-leave-type/create-leave-type.component';
import { HttpClientModule } from '@angular/common/http';
import { RolesComponent } from './components/roles/roles.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { CreatePermissionComponent } from './components/create-permission/create-permission.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManageEmployeeRoleComponent } from './components/manage-employee-role/manage-employee-role.component';
import { CategoryComponent } from './components/category/category.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StageComponent } from './components/stage/stage.component';
import { WorkFlowComponent } from './components/work-flow/work-flow.component';
import { CreatStageComponent } from './components/creat-stage/creat-stage.component';
import { CreatWorkFlowComponent } from './components/creat-work-flow/creat-work-flow.component';
import { MenuComponent } from './components/menu/menu.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { RequestStagesComponent } from './components/request-stages/request-stages.component';
import { ManageApprovalComponent } from './components/manage-approval/manage-approval.component';
import { BenefitTypeComponent } from './components/benefit-type/benefit-type.component';
import { CreateBenefitTypeComponent } from './components/create-benefit-type/create-benefit-type.component';

import { BenefitAvailabilityComponent } from './components/benefit-availability/benefit-availability.component';
import { CreateBenefitAvailabilityComponent } from './components/create-benefit-availability/create-benefit-availability.component';
import { AvailableMedicineComponent } from './components/available-medicine/available-medicine.component';
import { CreateAvailableMedicineComponent } from './components/create-available-medicine/create-available-medicine.component';
import { DesignationSubsidyComponent } from './components/designation-subsidy/designation-subsidy.component';
import { CreateDesignationSubsidyComponent } from './components/create-designation-subsidy/create-designation-subsidy.component';
import { CreateBulletinComponent } from './components/create-bulletin/create-bulletin.component';
import { BulletinComponent } from './components/bulletin/bulletin.component';
import { CurrencyTypesComponent } from './components/currency-types/currency-types.component';
import { CreateCurrencyTypesComponent } from './components/create-currency-types/create-currency-types.component';
import { TravelTypesComponent } from './components/travel-types/travel-types.component';
import { CreateTravelTypesComponent } from './components/create-travel-types/create-travel-types.component';
import { TravelPreferenceTimeComponent } from './components/travel-preference-time/travel-preference-time.component';
import { CreateTravelPreferenceTimeComponent } from './components/create-travel-preference-time/create-travel-preference-time.component';

import { CreateHRArticleComponent } from './components/create-hr-article/create-hr-article.component';
import { CreateHRPolicyComponent } from './components/create-hr-policy/create-hr-policy.component';
import { ManagePoliciesComponent } from './components/manage-policies/manage-policies.component';
import { ManageArticlesComponent } from './components/manage-articles/manage-articles.component';
import { EmployeeSelfServicesModule } from '../employee-self-services/employee-self-services.module';
import { TravelClassComponent } from './components/travel-class/travel-class.component';
import { CreateTravelClassesComponent } from './components/create-travel-classes/create-travel-classes.component';
import { LoanTypeComponent } from './components/loan-type/loan-type.component';
import { CreateLoanTypeComponent } from './components/create-loan-type/create-loan-type.component';
import { ExpenseTypeComponent } from './components/expense-type/expense-type.component';
import { CreateExpenseTypeComponent } from './components/create-expense-type/create-expense-type.component';
import { ImportantLinksComponent } from './components/important-links/important-links.component';
import { CreateImportantLinksComponent } from './components/create-important-links/create-important-links.component';
import { ShiftComponent } from './components/shift/shift.component';
import { CreateShiftComponent } from './components/create-shift/create-shift.component';


@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    CreateBulletinComponent,
    BulletinComponent,
    DesignationsComponent,
    CreateDesignationComponent,
    DepartmentsComponent,
    CreateDepartmentComponent,
    EmployeeTypeComponent,
    CreateEmployeeTypeComponent,
    LocationsComponent,
    CreateLocationComponent,
    TeamsComponent,
    CreateTeamComponent,
    EmployeesComponent,
    CreateEmployeeComponent,
    CountryComponent,
    CreateCountryComponent,
    StateComponent,
    CreateStateComponent,
    CityComponent,
    CreateCityComponent,
    EmployerComponent,
    CreateEmployerComponent,
    JobTitleComponent,
    CreateJobTitleComponent,
    LeaveStatusComponent,
    CreateLeaveStatusComponent,
    LeaveTypeComponent,
    CreateLeaveTypeComponent,
    RolesComponent,
    CreateRoleComponent,
    PermissionsComponent,
    CreatePermissionComponent,
    ManageEmployeeRoleComponent,
    CategoryComponent,
    CreateCategoryComponent,
    StageComponent,
    WorkFlowComponent,
    CreatStageComponent,
    CreatWorkFlowComponent,
    MenuComponent,
    CreateMenuComponent,
    RequestStagesComponent,
    ManageApprovalComponent,
    BenefitTypeComponent,
    CreateBenefitTypeComponent,
    BenefitAvailabilityComponent,
    CreateBenefitAvailabilityComponent,
    AvailableMedicineComponent,
    CreateAvailableMedicineComponent,
    DesignationSubsidyComponent,
    CreateDesignationSubsidyComponent,
    CurrencyTypesComponent,
    CreateCurrencyTypesComponent,
    TravelTypesComponent,
    CreateTravelTypesComponent,
    TravelPreferenceTimeComponent,
    CreateTravelPreferenceTimeComponent,
    CreateHRArticleComponent,
    CreateHRPolicyComponent,
    ManagePoliciesComponent,
    ManageArticlesComponent,
    TravelClassComponent,
    CreateTravelClassesComponent,
    LoanTypeComponent,
    CreateLoanTypeComponent,
    ExpenseTypeComponent,
    CreateExpenseTypeComponent,
    ImportantLinksComponent,
    CreateImportantLinksComponent,
    ShiftComponent,
    CreateShiftComponent,

  ],
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    EmployeeSelfServicesModule
  ],
  providers: [
    DatePipe
  ]

})
export class ConsoleModule { }
