// Ultra-simple authentication middleware
// Just checks if user data is provided in request

export const simpleUserCheck = (req, res, next) => {
    // For simple endpoints, we don't need complex authentication
    // Just proceed to the controller
    next();
};

export const requireRollNo = (req, res, next) => {
    const { rollNo } = req.body;
    
    if (!rollNo) {
        return res.status(400).json({ 
            error: 'Roll number is required' 
        });
    }
    
    next();
};

export const requireEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            error: 'Email is required' 
        });
    }
    
    next();
};