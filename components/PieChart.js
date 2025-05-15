import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Text } from 'react-native-svg';

const PieChart = ({ data, radius = 70, centerLabel }) => {
 const [debugMode, setDebugMode] = useState(true);

 useEffect(() => {
     if (data && data.length > 0) {
         console.log("PieChart: pieChartData:", data);
     } else {
         console.log("PieChart: No data received");
     }
 }, [data]);

 if (!data || data.length === 0) {
     return (
         <View style={styles.container}>
             <Text>No chart data available</Text>
         </View>
     );
 }

  const totalValue = data.reduce((sum, item) => {
         if (item && typeof item.value === 'number') {
             return sum + item.value;
         } else {
             console.warn("PieChart: Invalid item value", item);
             return sum;
         }
     }, 0);
     console.log("PieChart: totalValue:", totalValue);

 let startAngle = 0; // Initialize here
 const centerX = radius;
 const centerY = radius;

 return (
     <View style={[styles.container, { backgroundColor: 'transparent' }]}>
         <Svg height={radius * 2} width={radius * 2} >
             {data.map((item, index) => {
                 console.log("PieChart: item:", item);
                  let sliceAngle = (item.value / totalValue) * 360;
                if(data.length === 1){
                     sliceAngle = 360;
                 }
                 console.log(`PieChart: index: ${index} , Slice Angle: ${sliceAngle}, startAngle: ${startAngle}`);

                const x1 = centerX + radius * Math.cos(startAngle * (Math.PI / 180));
                 const y1 = centerY + radius * Math.sin(startAngle * (Math.PI / 180));

                 // Move startAngle calculation BEFORE x2, y2 calculation
                 const nextStartAngle = startAngle + sliceAngle;

                const x2 = centerX + radius * Math.cos((nextStartAngle) * (Math.PI / 180));
                 const y2 = centerY + radius * Math.sin((nextStartAngle) * (Math.PI / 180));
                 const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                  const d =   `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                 console.log("PieChart: Path D:", d);

                 console.log('PieChart: x1', x1, 'y1:', y1, 'x2:', x2, 'y2:', y2)

                 startAngle = nextStartAngle;


                 return (
                     <Path
                         key={index}
                         d={d}
                        fill={item.color}
                     />
                 );
             })}
             {centerLabel && (
                 <Text
                     x={centerX}
                     y={centerY}
                     textAnchor="middle"
                     fontSize={16}
                 >
                     {centerLabel}
                 </Text>
             )}
         </Svg>
     </View>
 );
};

const styles = StyleSheet.create({
 container: {
     alignItems: 'center',
     justifyContent: 'center',
 },
});

export default PieChart;