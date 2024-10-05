import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { DesignationsComponent } from './components/designations/designations.component';
import { CreateDesignationComponent } from './components/create-designation/create-designation.component';
import { CreateDepartmentComponent } from './components/create-department/create-department.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CreateEmployeeTypeComponent } from './components/create-employee-type/create-employee-type.component';
import { EmployeeTypeComponent } from './components/employee-type/employee-type.component';
import { CreateLocationComponent } from './components/create-location/create-location.component';
import { LocationsComponent } from './components/locations/locations.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { TeamsComponent } from './components/teams/teams.component';
import { CreateEmployeeComponent } from './components/create-employee/create-employee.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { CreateCountryComponent } from './components/create-country/create-country.component';
import { CountryComponent } from './components/country/country.component';
import { CreateStateComponent } from './components/create-state/create-state.component';
import { StateComponent } from './components/state/state.component';
import { CreateCityComponent } from './components/create-city/create-city.component';
import { CityComponent } from './components/city/city.component';
import { CreateEmployerComponent } from './components/create-employer/create-employer.component';
import { EmployerComponent } from './components/employer/employer.component';
import { CreateJobTitleComponent } from './components/create-job-title/create-job-title.component';
import { JobTitleComponent } from './components/job-title/job-title.component';
import { LeaveStatusComponent } from './components/leave-status/leave-status.component';
import { CreateLeaveStatusComponent } from './components/create-leave-status/create-leave-status.component';
import { CreateLeaveTypeComponent } from './components/create-leave-type/create-leave-type.component';
import { LeaveTypeComponent } from './components/leave-type/leave-type.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { RolesComponent } from './components/roles/roles.component';
import { CreatePermissionComponent } from './components/create-permission/create-permission.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { ManageEmployeeRoleComponent } from './components/manage-employee-role/manage-employee-role.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CategoryComponent } from './components/category/category.component';
import { AuthGuard } from 'src/app/auth/authService/auth.guard';
import { CreatStageComponent } from './components/creat-stage/creat-stage.component';
import { StageComponent } from './components/stage/stage.component';
import { CreatWorkFlowComponent } from './components/creat-work-flow/creat-work-flow.component';
import { WorkFlowComponent } from './components/work-flow/work-flow.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { MenuComponent } from './components/menu/menu.component';
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
import { ManageArticlesComponent } from './components/manage-articles/manage-articles.component';
import { ManagePoliciesComponent } from './components/manage-policies/manage-policies.component';
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

const routes: Routes = [
  { path: '', redirectTo: 'teams', pathMatch: 'full' },
  // { path: 'users', component: UsersComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'create-bulletin', component: CreateBulletinComponent },
  { path: 'bulletin', component: BulletinComponent },
  { path: 'update-bulletin/:id', component: CreateBulletinComponent },
  { path: 'create-designation', component: CreateDesignationComponent },
  { path: 'designations', component: DesignationsComponent },
  { path: 'update-designation/:id', component: CreateDesignationComponent },
  { path: 'create-department', component: CreateDepartmentComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'update-department/:id', component: CreateDepartmentComponent },
  { path: 'create-employee-type', component: CreateEmployeeTypeComponent },
  { path: 'employee-type', component: EmployeeTypeComponent },
  { path: 'update-employee-type/:id', component: CreateEmployeeTypeComponent },
  { path: 'create-location', component: CreateLocationComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'update-location/:id', component: CreateLocationComponent },
  { path: 'create-expense-type', component: CreateExpenseTypeComponent },
  { path: 'expense-types', component: ExpenseTypeComponent },
  { path: 'update-expense-type/:id', component: CreateExpenseTypeComponent },
  //shift component
  { path: 'schedule', component: ShiftComponent},
  { path: 'create-schedule', component: CreateShiftComponent },
  { path: 'update-schedule/:id', component: CreateShiftComponent },
  { path: 'create-important-link', component: CreateImportantLinksComponent },
  { path: 'important-links', component: ImportantLinksComponent },
  { path: 'update-important-link/:id', component: CreateImportantLinksComponent },
  { path: 'create-team', component: CreateTeamComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'update-team/:id', component: CreateTeamComponent },
  { path: 'manage-approval/:id', component: ManageApprovalComponent },
  { path: 'create-employee', component: CreateEmployeeComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'update-employee/:id', component: CreateEmployeeComponent },

  { path: 'create-country', component: CreateCountryComponent },
  { path: 'countries', component: CountryComponent },
  { path: 'update-country/:id', component: CreateCountryComponent },

  { path: 'create-state', component: CreateStateComponent },
  { path: 'states', component: StateComponent },
  { path: 'update-state/:id', component: CreateStateComponent },

  { path: 'create-city', component: CreateCityComponent },
  { path: 'cities', component: CityComponent },
  { path: 'update-city/:id', component: CreateCityComponent },

  { path: 'create-employer', component: CreateEmployerComponent },
  { path: 'employer', component: EmployerComponent },
  { path: 'update-employer/:id', component: CreateEmployerComponent },

  { path: 'create-job-title', component: CreateJobTitleComponent },
  { path: 'job-title', component: JobTitleComponent },
  { path: 'update-job-title/:id', component: CreateJobTitleComponent },

  { path: 'create-leave-status', component: CreateLeaveStatusComponent },
  { path: 'leave-status', component: LeaveStatusComponent },
  { path: 'update-leave-status/:id', component: CreateLeaveStatusComponent },

  { path: 'create-leave-type', component: CreateLeaveTypeComponent },
  { path: 'leave-type', component: LeaveTypeComponent },
  { path: 'update-leave-type/:id', component: CreateLeaveTypeComponent },

  { path: 'create-role', component: CreateRoleComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'update-role/:id', component: CreateRoleComponent },

  { path: 'create-permission', component: CreatePermissionComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'update-permission/:id', component: CreatePermissionComponent },
  { path: 'manage-employee-role/:id', component: ManageEmployeeRoleComponent },

  { path: 'create-category', component: CreateCategoryComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'update-category/:id', component: CreateCategoryComponent },

  { path: 'create-stage', component: CreatStageComponent },
  { path: 'stages', component: StageComponent },
  { path: 'update-stage/:id', component: CreatStageComponent },
  { path: 'request-stages', component: RequestStagesComponent },
  { path: 'create-workflow', component: CreatWorkFlowComponent },
  { path: 'workflows', component: WorkFlowComponent },
  { path: 'update-workflow/:id', component: CreatWorkFlowComponent },
  { path: 'create-menu', component: CreateMenuComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'update-menu/:id', component: CreateMenuComponent },

  { path: 'benefit-type', component: BenefitTypeComponent },
  { path: 'update-benefit-type/:id', component: CreateBenefitTypeComponent },
  { path: 'create-benefit-type', component: CreateBenefitTypeComponent },

  { path: 'benefit-availability', component: BenefitAvailabilityComponent },
  { path: 'update-benefit-availability/:id', component: CreateBenefitAvailabilityComponent },
  { path: 'create-benefit-availability', component: CreateBenefitAvailabilityComponent },

  { path: 'available-medicine', component: AvailableMedicineComponent },
  { path: 'update-available-medicine/:id', component: CreateAvailableMedicineComponent },
  { path: 'create-available-medicine', component: CreateAvailableMedicineComponent },

  { path: 'designation-subsidy', component: DesignationSubsidyComponent },
  { path: 'update-designation-subsidy/:id', component: CreateDesignationSubsidyComponent },
  { path: 'create-designation-subsidy', component: CreateDesignationSubsidyComponent },

  { path: 'currency-types', component: CurrencyTypesComponent },
  { path: 'update-currency-type/:id', component: CreateCurrencyTypesComponent },
  { path: 'create-currency-type', component: CreateCurrencyTypesComponent },

  { path: 'travel-types', component: TravelTypesComponent },
  { path: 'update-travel-type/:id', component: CreateTravelTypesComponent },
  { path: 'create-travel-type', component: CreateTravelTypesComponent },

  { path: 'travel-classes', component: TravelClassComponent },
  { path: 'update-travel-class/:id', component: CreateTravelClassesComponent },
  { path: 'create-travel-class', component: CreateTravelClassesComponent },

  { path: 'travel-preference-time', component: TravelPreferenceTimeComponent },
  { path: 'update-travel-preference-time/:id', component: CreateTravelPreferenceTimeComponent },
  { path: 'create-travel-preference-time', component: CreateTravelPreferenceTimeComponent },

  { path: 'policies-articles', component: ManageArticlesComponent },
  { path: 'update-policies-articles/:id', component: CreateHRArticleComponent },
  { path: 'create-policies-articles', component: CreateHRArticleComponent },

  { path: 'policies-documents', component: ManagePoliciesComponent },
  { path: 'update-policies-documents/:id', component: CreateHRPolicyComponent },
  { path: 'create-policies-documents', component: CreateHRPolicyComponent },

  { path: 'loan-type', component: LoanTypeComponent },
  { path: 'update-loan-type/:id', component:CreateLoanTypeComponent },
  { path: 'create-loan-type', component: CreateLoanTypeComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleRoutingModule { }
