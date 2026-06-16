var generatedOTP;

function forgotPassword(){

  var contact = prompt("Enter your registered Email or Phone Number");

  var users = JSON.parse(localStorage.getItem("users")) || [];

  var user = users.find(u => u.contact === contact);

  if(!user){
    showMessage("User not found","error");
    return;
  }

  // Generate OTP
  generatedOTP = Math.floor(100000 + Math.random()*900000);

  // Simulate sending email/SMS (for demo)
  showMessage("Demo OTP (for testing): " + generatedOTP,"success");

  // Ask user for OTP
  var enteredOTP = prompt("Enter the OTP sent to your email/phone");

  if(enteredOTP != generatedOTP){
    showMessage("Incorrect OTP","error");
    return;
  }

  // Reset password
  var newPass = prompt("Enter new password");
  var confirmPass = prompt("Confirm password");

  if(newPass !== confirmPass){
    showMessage("Passwords do not match","error");
    return;
  }

  user.password = newPass;
  localStorage.setItem("users", JSON.stringify(users));

  showMessage("Password changed successfully. Please login again.","success");

}