export const createBookingResponse = {
    "bookingId":"bid_100001",
    "origin":"Rajiv chowk, gurgaon",
    "destination":"Railway station, Anand Vihar, New Delhi",
    "fare": 550,
    "riderId":"ruid_000001",
    "partnerId":"puid_000001",
    "vehicleId":"vid_000001",
    "status":"IN_PROGRESS",
    "createdAt": new Date().toDateString(),
    "completedAt": new Date(+new Date() + 55 * 60 * 1000).toDateString(),
    "scheduledCompletionTime": new Date(+new Date() + 54 * 60 * 1000).toDateString()
  }
  
  export const mockBooking = {
    "bookingId":"bid_100002",
    "origin":"MG Road, gurgaon",
    "destination":"Railway station, Old delhi",
    "fare": 750,
    "riderId":"ruid_000001",
    "partnerId":"puid_000001",
    "vehicleId":"vid_000001",
    "status":"COMPLETED",
    "createdAt": new Date(+new Date() - 20 * 60 * 60 * 1000).toDateString(),
    "completedAt": new Date(+new Date() - 18.5 * 60 * 60 * 1000).toDateString(),
    "scheduledCompletionTime": new Date(+new Date() -18.5 * 60 * 60 * 1000).toDateString()
  }
  
  export const registerUserResponse = {
    "userId":"puid_000001",
    // "password":"test@1234",
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOiJydWlkXzAwMDAwMSIsInBhc3N3b3JkIjoidGVzdEAxMjM0In0.Zx5OlAmrAK9hlf3yXxmG6klxlruGDJy55tkFhVL9ZSI",
    "firstName":"Test",
    "lastName":"User 1",
    "gender":"M",
    "emailAddress":"test1@tester.com",
    "userType":"PARTNER",
    "dob": new Date(+new Date() - 30 * 365 * 24 * 60 * 60 * 1000).toDateString(),
    "address":
      {"addressLine":"line 1","addressLine2":"line2","city":"text city","state":"test state","country":"test country","pincode":"100001"},
    "mobileNumber":"8765432109",
    "drivingLicenseNumber":"DL_NO_TEST_1234",
    "vehicleRegistrationNumber":"VEH_NO_TEST_DL_34 1234",
    "createdAt": new Date(+new Date() -  50 * 24 * 60 * 60 * 1000).toDateString(),
  };
  