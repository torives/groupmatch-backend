
class AuthController {
    handleGoogleAuthCode(req, res) {
        console.log(req.body.token);
    }
}

const authController = new AuthController();
export default authController;