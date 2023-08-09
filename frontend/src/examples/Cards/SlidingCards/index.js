
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';


export default function SlidingCard({ data }) {
    return (
        <div className="slide-card">

           <Card sx={{ mx: 'auto', marginTop: '15px', boxShadow: 'none' }}>
                <CardContent style={{ display: 'flex' }}>
                    <img src={data.notification.imageUrl} alt={data.notification.title} width='70px' />
                    <div>
                        <Typography>{data.notification.title}</Typography>
                        <Typography>{data.notification.description}</Typography>
                    </div>
                </CardContent>
            </Card> 

        </div>
    );
};


SlidingCard.propTypes = {
    data: PropTypes.string.isRequired,
};