function Createservice() {
  this._entityId = null;
  this._entityName = null;
  this._clientUrl = null;
  var $thisClass = this;
  this._xrm = null;

  $(document).ready(function () {
    $thisClass.init();
    End();
  });
  debugger;
  var contactId = "";
  var Contactlastname = "";
  var customerserviceid = "";
  var customerserviceName = "";
  var Apiparameters = {};
  
}
 function init() {

  var $thisClass = this;
  $thisClass.FindXrm();
  if ($thisClass._xrm.Internal.isUci())
    $thisClass.AddCancelBtn();
  
  $('[data-action="next"]').on('click', function (event) { $thisClass.nextstep_click(this, event); });
  $('[title="ADSL-service"]').removeClass('d-none');
 
  this._clientUrl = window.parent.Xrm.Page.context.getClientUrl();
  this._clientUrl = $thisClass._xrm.Page.context.getClientUrl();

};
 function nextstep_click(sender, event) {
  debugger;

  var currentStep = $(sender).data('content');
  switch (currentStep) {


    case 'ADSL-service':
      this.StepADSLService(sender, event);
      break;
    case 'NationalCode':
      this.StepNationalCode(sender, event);
      break;
    case 'PersonRegistrationForm':
      this.StepCreateContact(sender, event);
      break;
    case 'Createservice':
      this.StepCreateCustomerService(sender, event);
      break;
    default:
      alert('مرحله نا مشخص');
      break;
  }
};
function StepCreateContact(sender, event) {
  $('[title="alert"]').addClass('d-none');
  $('.loader').removeClass('d-none');
  var model ={};
  var $thisClass = this;
 // var entity = {};


  model.Name = $('#FirstName').val()+ $('#LastName').val();
  model.FirstName = $('#FirstName').val();
  model.LastName = $('#LastName').val();
  model.NationalId = $("input[name='NationalCode']").val();
  model.PhoneNumber = $('#MobileNumber').val();
  model.PostalCode = $('#Postalcode').val();
  


  $thisClass.RegisterContact(JSON.stringify(model));
  $('.loader').addClass('d-none');

}
 function StepADSLService(sender, event) {
  $('[title="alert"]').addClass('d-none');
  $('.loader').removeClass('d-none');
  $("input[name='ADSL-PhoneNumber']").removeClass('is-invalid');
  var $thisClass = this;
  var parameters = {};
  parameters.PhoneNumber = $("input[name='ADSL-PhoneNumber']").val();
  Apiparameters.PhoneNumber = $("input[name='ADSL-PhoneNumber']").val();
  Apiparameters.ServiceType = 2;
  var filter = /^[0-9-+]+$/;
  if ((!filter.test(parameters.PhoneNumber)) || (parameters.PhoneNumber.length !== 11)) {
    $("input[name='ADSL-PhoneNumber']").addClass('is-invalid');
    $("input[name='ADSL-PhoneNumber']").closest('.form-floating').find('.invalid-feedback').html(' شماره تلفن وارد شده معتبر نیست .');
    $('.loader').addClass('d-none');
    return;
  }
  $thisClass.inquiryCustomerService();

}
 function RegisterContact(parameter) {
  $('[title="alert"]').addClass('d-none');
  var parameters = {};
  parameters.InputModel = parameter;
  var $thisClass = this;
  var req = new XMLHttpRequest();
  req.open("POST", window.parent.frames[0].Xrm.Page.context.getClientUrl() + "/api/data/v9.0/action name", true);
  req.setRequestHeader("OData-MaxVersion", "4.0");
  req.setRequestHeader("OData-Version", "4.0");
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 204||this.status === 200) {
            
              var results = JSON.parse(this.response);
              if(results.HasError==true)
              {
                $('[title="alert"]').removeClass('d-none');
                $('[title="alert"]').html(results.Message);
                //window.parent.frames[0].Xrm.Utility.alertDialog(results.Message);
                 return;
              }
              else
              {
              
              contactId = results.ContactID;
              Contactlastname =  $('#FirstName').val()+$('#LastName').val();
              customerserviceName = $('#FirstName').val()+$('#LastName').val();
              $thisClass._entityId = contactId;
              $('[title="Person-registration-form"]').addClass('d-none');     
              $('[title="Createservice"]').removeClass('d-none');
              $('.success-alert .message').html('درصورت تایید بر روی دکمه ساخت سرویس کلیک نمایید ');
              //$('#ContactInquiryp').html(Contactlastname);
              }
        } else {
                $('[title="alert"]').removeClass('d-none');
                $('[title="alert"]').html(this.statusText);
                return;
            //window.parent.frames[0].Xrm.Utility.alertDialog(this.statusText);
          }
      }
  };
  req.send(JSON.stringify(parameters));
}
 

function StepNationalCode(sender, event) {
  $('.loader').removeClass('d-none');
  $('[title="alert"]').addClass('d-none');
  var $thisClass = this;
  $(sender).closest('.card').addClass('d-none');
  var parameters = {};
  parameters.NationalCode = $("input[name='NationalCode']").val();
  var filter = /^([0-9]){10}$/;

  if ((!filter.test(parameters.NationalCode)) || (parameters.NationalCode.length !== 10)) {
    $("input[name='NationalCode']").addClass('is-invalid');
    $("input[name='NationalCode']").closest('.form-floating').find('.invalid-feedback').html('کد ملی وارد شده اشتباه است ');
    $('.loader').addClass('d-none');
    $(sender).closest('.card').removeClass('d-none');
    return;

  }
  $thisClass.inquiryContacts();
}
Createservice.prototype.StepCreateCustomerService = function (sender, event) {
  $('[title="alert"]').addClass('d-none');
  $('.loader').removeClass('d-none');
  $('[title="Createservice"]').addClass('d-none');
  $(sender).closest('.card').addClass('d-none');
  
  var $thisClass = this;

  $(sender).closest('.card').addClass('d-none');
  $thisClass.CallApi(Apiparameters);
  }


 function CallApi(parameters) {
  $('[title="alert"]').addClass('d-none');
  parameters.Provider = parseInt($("input[name='providertype']:checked").val());
  parameters.IsServicePersonel = true;
  //parameters.Provider = 63;
  var $thisClass = this;
  var req = new XMLHttpRequest();
  req.open("POST", this._clientUrl + "/api/data/v9.0/contacts(" + this._entityId + ")/Microsoft.Dynamics.CRM.acton name", true);

  req.setRequestHeader("OData-MaxVersion", "4.0");
  req.setRequestHeader("OData-Version", "4.0");
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function () {
    if (this.readyState === 4) {
      req.onreadystatechange = null;
      if (this.status === 204||this.status === 200) {
        var obj = JSON.parse(this.response);
        customerserviceid = obj.customerserviceid; 

        $('.loader').addClass('d-none');  
        $('[title="end"]').removeClass('d-none');
        $('.success-alert').removeClass('d-none');
        $('.success-alert .message').html('جهت تکمیل اطلاعات بر روی دکمه زیر کلیک کنید');

      } else {

        var obj = JSON.parse(this.response);
        $('.loader').addClass('d-none');  
        $('[title="Createservice"]').removeClass('d-none');
        $('.success-alert').addClass('d-none');
        $('.error-alert').removeClass('d-none');
        $('.error-alert .message').html(obj.error.message);
      }
    }
  };
  req.send(JSON.stringify(parameters));
}
var createservice = new Createservice();

function End(){
  var customerservice_value = window.parent.frames[0].Xrm.Page.getAttribute("entityname").getValue()[0].id.replace("{", "").replace("}", "");
  var statusReason = window.parent.frames[0].Xrm.Page.getAttribute("statuscode").getValue();

  if(customerservice_value !=null)
  {
    $('.loader').addClass('d-none'); 
    $('[title="Createservice"]').addClass('d-none'); 
    $('[title="Person-registration-form"]').addClass('d-none'); 
    $('[title="National-Code"]').addClass('d-none'); 
    $("[title='ADSL-service']").addClass('d-none');
    $('[title="end"]').removeClass('d-none');
    $('.success-alert').removeClass('d-none');
    $('.success-alert .message').html('  با موفقیت ثبت شد');
    $('.btn-outline-success').addClass('d-none');
    $('[title="DeleteServiceButtom"]').removeClass('d-none');
    
    if(statusReason==100000000)//canceled
        {
          $('[title="DeleteServiceButtom"]').addClass('d-none');
          $('.success-alert .message').html('درخواست  مورد نظر کنسل گردیده است');
        }

    var req = new XMLHttpRequest();
    req.open("GET", window.parent.frames[0].Xrm.Page.context.getClientUrl() + "/api/data/v9.0/actionname("+ customerservice_value +")?$select=_value", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
               var result = JSON.parse(this.response);
               var value = result["fieldname"];
               var value_formatted = result["value@OData.Community.Display.V1.FormattedValue"];
               var value_lookuplogicalname = result["value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                if(value_formatted == "Test1 ")
                {
                  $('[title="LinkParsonline"]').removeClass('d-none');
                }
                if(value_formatted == "Test2")
                {
                  $('[title="LinkHiWeb"]').removeClass('d-none');
                }
               
          } else {
            window.parent.frames[0].Xrm.Utility.alertDialog(this.statusText);
        }
    }
};
req.send();
  }
}
function FillFields() {

  // Contact
  var lookupCustomerValue = new Array();
  lookupCustomerValue[0] = new Object();
  lookupCustomerValue[0].id = contactId;
  lookupCustomerValue[0].name = Contactlastname;
  lookupCustomerValue[0].entityType = "entityname";
  window.parent.frames[0].Xrm.Page.getAttribute('entityname').setValue(lookupCustomerValue);

  // customerservice
  var lookupCustomerServiceValue = new Array();
  lookupCustomerServiceValue[0] = new Object();
  lookupCustomerServiceValue[0].id = customerserviceid;
  lookupCustomerServiceValue[0].name = customerserviceName;
  lookupCustomerServiceValue[0].entityType = "entityname";
  window.parent.frames[0].Xrm.Page.getAttribute('entityname').setValue(lookupCustomerServiceValue);
  window.parent.Xrm.Page.data.save();
  window.location.reload();
}
function DeleteService() {
  
  var actionname = window.parent.frames[0].Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

  var req = new XMLHttpRequest();
  req.open("POST", window.parent.frames[0].Xrm.Page.context.getClientUrl() + "/api/data/v9.0/action name("+actionname+")/Microsoft.Dynamics.CRM.actionname", true);
  req.setRequestHeader("OData-MaxVersion", "4.0");
  req.setRequestHeader("OData-Version", "4.0");
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 200) {
              var results = JSON.parse(this.response)
              window.parent.Xrm.Page.data.save();
              window.parent.location.reload();
          } else {
              window.parent.frames[0].Xrm.Utility.alertDialog(this.statusText);
          }
      }
  };
  req.send();
}
