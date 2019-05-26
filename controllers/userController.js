class UserController {
    createUser(req, res) {
        return res.status(500).send({
            success: "false",
            message: "not implemented"
        });
    }
    
    updateUser(req, res) {
        return res.status(500).send({
            success: "false",
            message: "not implemented"
        });
    }
}
const userController = new UserController();
export default userController;