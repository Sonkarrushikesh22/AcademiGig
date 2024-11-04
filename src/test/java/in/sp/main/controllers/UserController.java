package in.sp.main.controllers;

import org.apache.catalina.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping ("/user")
    public String addUserDetails(@RequestBody User user) {
        return null;
    }
}
