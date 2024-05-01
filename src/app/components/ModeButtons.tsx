"use client";
import React from "react";
import { useState } from "react";

interface MoodFoods {
  [mood: string]: string[];
}

const MoodButtons = () => {
    // 기본 기분 상태는 null로 설정
    const [selectedMood, setSelectedMood] = useState<null | string>(null);
    const [recommandFood, setRecommandFood] = useState<null | string>(null);

    

    const moodFoods: MoodFoods = {
      Joy: ["피자", "아이스크림", "초밥", "파스타", "햄버거"],
      Sadness: ["죽", "치킨 스프", "초콜릿", "마카로니 치즈", "라면"],
      Anger: ["고추장찌개", "매운닭갈비", "불고기", "마라탕", "카레"],
      Anxiety: ["녹차", "잡곡밥", "블루베리", "견과류", "요거트"],
      Calm: ["샐러드", "그라놀라", "스무디", "푸딩", "허니버터칩"],
      Excitement: ["스테이크", "초콜릿 케이크", "망고 스무디", "불닭볶음면", "타코"],
      Surprise: ["타코", "마카롱", "파스텔", "몽블랑", "스시"]
    };
    
  
    // 기분을 선택할 때 호출되는 함수
    const handleMoodSelect = (mood: string) => {
      setSelectedMood(mood);
      const foods = moodFoods[mood];
      if (!foods) {
        return "죄송합니다. 해당 기분에 대한 음식 추천을 찾을 수 없습니다.";
      }
    
      const randomIndex = Math.floor(Math.random() * foods.length);
      setRecommandFood(foods[randomIndex]);
    };
  
    return (
      <div>
        <h2>기분을 선택하세요:</h2>
        <div>
          <button onClick={() => handleMoodSelect('Joy')}>기쁨</button>
          <button onClick={() => handleMoodSelect('Sadness')}>슬픔</button>
          <button onClick={() => handleMoodSelect('Anger')}>분노</button>
          <button onClick={() => handleMoodSelect('Anxiety')}>불안</button>
          <button onClick={() => handleMoodSelect('Calm')}>평온</button>
          <button onClick={() => handleMoodSelect('Excitement')}>흥분</button>
          <button onClick={() => handleMoodSelect('Surprise')}>놀라움</button>
        </div>
        {selectedMood && <p>선택한 기분: {selectedMood}</p> }
        {recommandFood  && <p>추천 음식: {recommandFood}</p>}
      </div>
    );
  };
  
  export default MoodButtons;