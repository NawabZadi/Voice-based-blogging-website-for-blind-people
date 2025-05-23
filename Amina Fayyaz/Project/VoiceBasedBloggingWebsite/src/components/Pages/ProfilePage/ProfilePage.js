import React from "react";
import ProfileUI from "../../../../containers/User/Profile/ProfileUI/ProfileUI";

const ProfilePage = (props) => {
  return (
    <React.Fragment>
      <ProfileUI {...props} />
    </React.Fragment>
  );
};

export default ProfilePage;