'use client'
 
import { useRouter } from 'next/navigation'
import { useState } from "react";

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

    const moodFoods: MoodFoods = {
        Joy: ["피자", "아이스크림", "초밥", "파스타", "햄버거"],
        Sadness: ["죽", "치킨 스프", "초콜릿", "마카로니 치즈", "라면"],
        Anger: ["고추장찌개", "매운닭갈비", "불고기", "마라탕", "카레"],
        Anxiety: ["녹차", "잡곡밥", "블루베리", "견과류", "요거트"],
        Calm: ["샐러드", "그라놀라", "스무디", "푸딩", "허니버터칩"],
        Excitement: [
          "스테이크",
          "초콜릿 케이크",
          "망고 스무디",
          "불닭볶음면",
          "타코",
        ],
        Surprise: ["타코", "마카롱", "파스텔", "몽블랑", "스시"],
      };

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        const foods = moodFoods[mood];
        if (!foods) {
          return "죄송합니다. 해당 기분에 대한 음식 추천을 찾을 수 없습니다.";
        }
    
        const randomIndex = Math.floor(Math.random() * foods.length);
        setSelectedMoodFood(foods[randomIndex]);
        
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