package in.sp.main.controllers;

import in.sp.main.services.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping ("/user")
    public User addUserDetails(@RequestBody User user) {
        return userService.createUser(user);
    }
}
