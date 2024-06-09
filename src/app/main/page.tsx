'use client'
 
import { useRouter } from 'next/navigation'
import styles from './main.module.css'
import Button from '@mui/material/Button';


const Main = () => {

    const router = useRouter();

    const handleNavigate = () => {
        router.push('/wizard/emotion');
    };

    return (
        <div className={styles.mainContainer}>
            <h1>선택</h1>
            <div className={styles.btnBox}>
                <Button onClick={handleNavigate} variant="contained" size="large" style={{ margin: '10px' }}>기분</Button>
                <Button variant="contained" size="large" style={{ margin: '10px' }}>날씨</Button>     
            </div>        
        </div> 
    )
}

export default Main;