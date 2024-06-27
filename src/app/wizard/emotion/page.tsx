'use client'
 
import { useRouter } from 'next/navigation'
import { useState } from "react";
import axios from 'axios'

import styles from './emotion.module.css'
import Button from '@mui/material/Button';

import useMapsStore from "../../stores/map";


const Emotion = () => {

    const router = useRouter();

    const { setSelectedMoodFood, selectedMoodFood} = useMapsStore();
    const [selectedMood, setSelectedMood] = useState<null | string>(null);

    const handleNavigate = () => {
        router.push('/main');
    };
    

    const moodArr = ['Joy', 'Sadness', 'Anger', 'Anxiety',  'Calm', 'Excitement','Surprise'];


    const  handleMoodSelect = async (mood: string) => {
        setSelectedMood(mood);

        const { data: { data: { food } } } = await axios.get(`/wizard/emotion/api?mood=${mood}`);

        if (!food) {
          return "죄송합니다. 해당 기분에 대한 음식 추천을 찾을 수 없습니다.";
        }

        setSelectedMoodFood(food);
        
        router.push('/wizard/map');
      };

    return (
        <div className={styles.emotionContainer}>
            <h1>선택</h1>
            <div className={styles.btnBox}>
                {moodArr.map((mood) => (
                    <Button key={mood} onClick={() => handleMoodSelect(mood)} variant="outlined" size="large"  style={{ margin: '10px' }}>
                        {mood}
                    </Button>
                ))}
            </div>        
            <div className={styles.initBtnBox}>
                <Button onClick={handleNavigate} variant="outlined"  size="Xlarge" color="secondary">처음으로</Button>
            </div>

        </div> 
    )
}

export default Emotion;