import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? <StarIcon key={i} style={{ color: '#FFD700', fontSize: '20px' }} /> : <StarBorderIcon key={i} style={{ color: '#FFD700', fontSize: '20px' }} />
      );
    }
    return stars;
  };

  return (
    <Card style={{ border: '1px solid #ddd', boxShadow: 'none' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image_url}
        alt={product.product_name}
      />
      <CardContent style={{ height: '70px' }}>
        <Typography variant="body1" component="div" className="product-name">
          {product.product_name}
        </Typography>
        <div>{renderStars(Math.round(product.star_rating))}</div>
        <Typography variant="h6" component="div" color="textPrimary">
          {product.price}
        </Typography>
      </CardContent>
      <Button variant="contained" style={{ backgroundColor: '#c00', color: '#fff', margin: '10px' }}>
        Add
      </Button>
    </Card>
  );
};

export default ProductCard;
