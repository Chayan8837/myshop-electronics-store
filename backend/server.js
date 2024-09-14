const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const otpService = require('./otpService'); // Import the OTP service
const jwt = require('jsonwebtoken');
const multer= require('multer')

const app = express();
app.use(cors());
app.use(bodyParser.json());
const JWT_SECRET = 'myapp';

// Define the Cart schema
const CartSchema = new mongoose.Schema({
  user: { type: String, required: true },
  products: [
    {
      description: { type: String, required: true },
      id: { type: String, required: true },
      name: { type: String, required: true },
      
      oldPrice: { type: String, required: true },
      newPrice: { type: String, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const Cart = mongoose.model('Cart', CartSchema);


//Address schema


const addressSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  phone:String,
  street: String,
  city: String,
  state: String,
  zip: String,
});

const Address = mongoose.model('Address', addressSchema);











mongoose.connect('mongodb://localhost:27017/webkriti')
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));
  app.post('/add-to-cart', async (req, res) => {
    const { user, product } = req.body;
  
    try {
      let cart = await Cart.findOne({ user });
  
      if (cart) {
        const existingProduct = cart.products.find(p => p.id == product.id);
  
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push(product);
        }
      } else {
        cart = new Cart({
          user,
          products: [product]
        });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Failed to add product to cart' });
    }
  });


  app.get('/cart/:user', async (req, res) => {
    const { user } = req.params;
  
    try {
      const cart = await Cart.findOne({ user });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ message: 'Failed to retrieve cart' });
    }
  });




// OTP request endpoint
app.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const otp = otpService.generateOTP();
  try {
    await otpService.saveOtpToDatabase(email, otp);
    await otpService.sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  try {
    const otpRecord = await otpService.OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    await otpService.OTP.updateOne({ email, otp }, { otp: '000000' });
    
    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    await otpService.sendaboutEmail(name, email, message);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});



app.post('/add-address',async(req,res)=>{
  const {email,name,phone,street,city,state,zip}=req.body;
  try{
    const address= new Address({email,name,phone,street,city,state,zip});
    await address.save();
    res.status(200).send('Address saved successfully');
  }
  catch(error){
    if (error.code === 11000) {
      res.status(400).send('Email already exists');
  } else {
      res.status(500).send('Error saving address');
  }

  }
}
)


app.get('/get-address/:user', async (req, res) => {
  const { user } = req.params;
  try {
      const address = await Address.findOne({ email: user });
      if (address) {
          res.status(200).json(address);
          console.log("address send successfully");
          
      } else {
          res.status(404).send('Address not found');
      }
  } catch (error) {
      res.status(500).send('Error retrieving address');
  }
});




app.post('/accept-payment', (req, res) => {
  const { orderId } = req.body;
  if (orders[orderId]) {
      orders[orderId].status = 'Paid';
      res.send('Payment accepted and logged.');
  } else {
      res.status(404).send('Order not found.');
  }
});



app.listen(3000, () => {
  console.log('App is running on port 3000');
});
















