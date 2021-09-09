import { UserService } from '../user.service';
export declare class AuthService {
    private userService;
    constructor(userService: UserService);
    validateUser(email: string, pass: string): Promise<any>;
}
