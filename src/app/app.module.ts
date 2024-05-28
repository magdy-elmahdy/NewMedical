import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon'
// import { JwtModule } from "@auth0/angular-jwt";
import {LottieModule} from 'ngx-lottie';
import { NgxPaginationModule } from 'ngx-pagination';
import player from 'lottie-web';
import { MaterialsModule } from './materials/materials.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/shared/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { AddCustomerComponent } from './components/admin/add-customer/add-customer.component';
import {MatSelectModule} from '@angular/material/select';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { CustomerDetailsComponent } from './components/admin/customer-details/customer-details.component';
import { AllCustomersComponent } from './components/admin/all-customers/all-customers.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { UsersComponent } from './components/admin/users/users.component';
import { SearchPipe } from './pipes/search.pipe';
import { BasicComisionComponent } from './components/admin/bassic-comision/basic-comision.component';
import { EarlyAndCollectComponent } from './components/admin/early-and-collect/early-and-collect.component';
import { CommissionsComponent } from './components/admin/commissions/commissions.component';
import { BrokerCommissionsComponent } from './components/admin/broker-commissions/broker-commissions.component';
import { AllEarlyCollectComponent } from './components/admin/all-early-collect/all-early-collect.component';
import { AllPlansComponent } from './components/admin/all-plans/all-plans.component';
import { AllbenefitsComponent } from './components/admin/allbenefits/allbenefits.component';
import { AddBenefitComponent } from './components/admin/add-benefit/add-benefit.component';
import { AddPlanComponent } from './components/admin/add-plan/add-plan.component';
import { ExamComponent } from './components/admin/exam/exam.component';
import { AddBedsComponent } from './components/Offer/add-family/add-beds.component';
import { AllPolicesComponent } from './components/Offer/All-Offers/all-polices.component';
import { PolicyDetailsComponent } from './components/Offer/policy-details/policy-details.component';
import { CustomPlanComponent } from './components/Offer/custom-plan/custom-plan.component';
import { SelectPlanToPolicyComponent } from './components/Offer/select-plan-to-policy/select-plan-to-policy.component';
import { PlansAndItesBenfitsComponent } from './components/Offer/plans-and-ites-benfits/plans-and-ites-benfits.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DropdownModule } from 'primeng/dropdown';
import { UploadPlansFileComponent } from './components/Offer/upload-plans-file/upload-plans-file.component';
import { UplaodGroupFileComponent } from './components/Offer/uplaod-group-file/uplaod-group-file.component';
import { CalculationsOfPolicyComponent } from './components/Offer/calculations-of-policy/calculations-of-policy.component';
import { PlansOfPolicyComponent } from './components/Offer/plans-of-policy/plans-of-policy.component';
import { GroupOfPolicyComponent } from './components/Offer/group-of-policy/group-of-policy.component';
import { TpAFeesComponent } from './components/admin/tp-a-fees/tp-a-fees.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { OfferDetailsComponent } from './components/Offer/offer-details/offer-details.component';
import { OfferVersionsComponent } from './components/Offer/offer-versions/offer-versions.component';
import { WelcomePageComponent } from './components/admin/welcome-page/welcome-page.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReinsurerDataComponent } from './components/admin/reinsurer-data/reinsurer-data.component';
import { AllReinsurersComponent } from './components/admin/all-reinsurers/all-reinsurers.component';
import { ConvertToPolicyComponent } from './components/Policy/convert-to-policy/convert-to-policy.component';
import { PolicyCalculationsComponent } from './components/Policy/policy-calculations/policy-calculations.component';
import { AllPolicessComponent } from './components/Policy/all-policess/all-policess.component';
import { ReNewPolicyComponent } from './components/Policy/re-new-policy/re-new-policy.component';
import { AddOfferComponent } from './components/Offer/Add-Offer/addOffer.component';
import { ActivatePolicyComponent } from './components/Policy/activate-policy/groupNetPrem.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ClaimComponent} from './components/Compensation/claim/claim.component';
import { PolicyDetailssComponent } from './components/Policy/policy-details/policy-details.component';
import { SettingPolicyComponent } from './components/Policy/setting-policy/setting-policy.component';
import { BranchesComponent } from './components/admin/branches/branches.component';
import { InitialClaimComponent } from './components/Compensation/initial-claim/initial-claim.component';
import { InitialEndorsmentComponent } from './components/Compensation/initial-endorsment/initial-endorsment.component';
import { EndorsmentComponent } from './components/Compensation/endorsment/endorsment.component';
import { CancelUpdateComponent } from './components/Compensation/cancel-update/cancel-update.component';
import { CollectionUserComponent } from './components/collection/collection-user/collection-user.component';
import { CollectionAdminComponent } from './components/collection/collection-admin/collection-admin.component';
import { PaymentWayComponent } from './components/collection/payment-way/payment-way.component';
import { ClaimsPayComponent } from './components/collection/claims-pay/claims-pay.component';
import { CommissionPaymentComponent } from './components/collection/commission-payment/commission-payment.component';
import { EndorsmentPremComponent } from './components/Compensation/endorsment-prem/endorsment-prem.component';
import { PrintSubbliyComponent } from './components/collection/print-subbliy/print-subbliy.component';
import { CommissionPermissionComponent } from './components/collection/commission-permission/commission-permission.component';
import { ModelPortfolioComponent } from './components/collection/model-portfolio/model-portfolio.component';
import { UrlComponent } from './components/shared/url/url.component';
import { CookieService } from 'ngx-cookie-service';
import { BrokeragePayComponent } from './components/collection/brokerage-pay/brokerage-pay.component';
import { TpaPayComponent } from './components/collection/tpa-pay/tpa-pay.component';
import { ReportsComponent } from './components/reports/reports/reports.component';
import { PolicyCreationComponent } from './components/reports/policy-creation/policy-creation.component';
import { ClaimDetailsReportComponent } from './components/reports/claim-details-report/claim-details-report.component';
import { OfferReportsComponent } from './components/reports/offer-reports/offer-reports.component';
import { CustomersReportComponent } from './components/reports/customers-report/customers-report.component';
import { ModelBrokerageComponent } from './components/collection/model-brokerage/model-brokerage.component';
import { CreateHonstyComponent } from './components/collection/create-honsty/create-honsty.component';
import { ModelDailyCollectionComponent } from './components/collection/model-daily-collection/model-daily-collection.component';
import { ModelPolicyComponent } from './components/Policy/model-policy/model-policy.component';
import { AbsPipe } from './pipes/abs.pipe';
import { AllExchangePremitComponent } from './components/collection/all-exchange-premit/all-exchange-premit.component';
import { UnderCollectionComponent } from './components/reports/under-collection/under-collection.component';
import { DueCommissionComponent } from './components/reports/due-commission/due-commission.component';
import { PendingPortfolioComponent } from './components/collection/pending-portfolio/pending-portfolio.component';
import { SourceRecordComponent } from './components/reports/issuance/source-record/source-record.component';
import { TreasuryComponent } from './components/reports/treasure/treasure.component';
import { UnderCollectorPremiumComponent } from './components/reports/under-collector-premium/under-collector-premium.component';
import { PaiedCollectorPremiumComponent } from './components/reports/paied-collector-premium/paied-collector-premium.component';
import { PendingInsuredComponent } from './components/reports/pending-insured/pending-insured.component';
import { AllEndorsmentComponent } from './components/Policy/all-endorsment/all-endorsment.component';
import { NegativeBrokeragesComponent } from './components/reports/negative-brokerages/negative-brokerages.component';
import { SecretariatsRecordsComponent } from './components/reports/secretariats-records/secretariats-records.component';
import { CreateBankComponent } from './components/admin/create-bank/create-bank.component';
import {MatChipsModule} from '@angular/material/chips';
import { RestriksComponent } from './components/shared/restriks/restriks.component';
import { DepartmentsComponent } from './components/admin/departments/departments.component';
import { DueCommissionForCollectorComponent } from './components/reports/due-commission-for-collector/due-commission-for-collector.component';
import { PaidCommissionsComponent } from './components/reports/paid-commissions/paid-commissions.component';
import { GovernoratesComponent } from './components/admin/governorates/governorates.component';
import { ReInsuranceBrokerComponent } from './components/reinsurance/re-insurance-broker/re-insurance-broker.component';
import { ReInsuranceCompanyComponent } from './components/reinsurance/re-insurance-company/re-insurance-company.component';
import { MedicalTreatySetupComponent } from './components/reinsurance/medical-treaty-setup/medical-treaty-setup.component';
import { MainComponent } from './components/shared/main/main.component';
export function playerFactory(){
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SpinnerComponent,
    AddCustomerComponent,
    NavbarComponent,
    SidebarComponent,
    CustomerDetailsComponent,
    AllCustomersComponent,
    AllEarlyCollectComponent,
    LoginComponent,
    SignUpComponent,
    UsersComponent,
    SearchPipe,
    BasicComisionComponent,
    EarlyAndCollectComponent,
    CommissionsComponent,
    BrokerCommissionsComponent,
    AllPlansComponent,
    AllbenefitsComponent,
    AddBenefitComponent,
    AddPlanComponent,
    AddOfferComponent,
    ExamComponent,
    AddBedsComponent,
    AllPolicesComponent,
    PolicyDetailsComponent,
    CustomPlanComponent,
    SelectPlanToPolicyComponent,
    PlansAndItesBenfitsComponent,
    UploadPlansFileComponent,
    UplaodGroupFileComponent,
    CalculationsOfPolicyComponent,
    PlansOfPolicyComponent,
    GroupOfPolicyComponent,
    TpAFeesComponent,
    OfferDetailsComponent,
    OfferVersionsComponent,
    WelcomePageComponent,
    ReinsurerDataComponent,
    AllReinsurersComponent,
    ConvertToPolicyComponent,
    PolicyCalculationsComponent,
    AllPolicessComponent,
    ReNewPolicyComponent,
    ActivatePolicyComponent,
    ClaimComponent,
    PolicyDetailssComponent,
    SettingPolicyComponent,
    BranchesComponent,
    InitialClaimComponent,
    InitialEndorsmentComponent,
    EndorsmentComponent,
    CancelUpdateComponent,
    CollectionUserComponent,
    CollectionAdminComponent,
    PaymentWayComponent,
    ClaimsPayComponent,
    CommissionPaymentComponent,
    EndorsmentPremComponent,
    PrintSubbliyComponent,
    CommissionPermissionComponent,
    ModelPortfolioComponent,
    UrlComponent,
    BrokeragePayComponent,
    TpaPayComponent,
    ReportsComponent,
    PolicyCreationComponent,
    ClaimDetailsReportComponent,
    OfferReportsComponent,
    CustomersReportComponent,
    ModelBrokerageComponent,
    CreateHonstyComponent,
    ModelDailyCollectionComponent,
    ModelPolicyComponent,
    AbsPipe,
    AllExchangePremitComponent,
    UnderCollectionComponent,
    DueCommissionComponent,
    PendingPortfolioComponent,
    SourceRecordComponent,
    TreasuryComponent,
    UnderCollectorPremiumComponent,
    PaiedCollectorPremiumComponent,
    PendingInsuredComponent,
    AllEndorsmentComponent,
    NegativeBrokeragesComponent,
    SecretariatsRecordsComponent,
    CreateBankComponent,
    RestriksComponent,
    DepartmentsComponent,
    DueCommissionForCollectorComponent,
    PaidCommissionsComponent,
    GovernoratesComponent,
    ReInsuranceBrokerComponent,
    ReInsuranceCompanyComponent,
    MedicalTreatySetupComponent,
    MainComponent,
  ],
  imports: [
    DropdownModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    LottieModule.forRoot({player:playerFactory}),
    FontAwesomeModule,
    NgxPaginationModule,
    FormsModule,
    MatSelectModule,
    MatChipsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot({
      progressBar:true,
      progressAnimation:'decreasing',
      timeOut: 4000
    }),
    MatMomentDateModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
      }
      }) 

  
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },CookieService
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}