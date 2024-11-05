package in.sp.main.services;
import org.springframework.beans.factory.annotation.Autowired;
import in.sp.main.repositories.UserRepository;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(User user) {

        return  userRepository.save(user);
    }
}
