import { useEffect, useRef, useState } from 'react';
import { BubbleData, KeywordData } from '../../types/types';
import KeywordBubble from './KeywordBubble';
import CircleContainer from '../../circlepacker/CircleContainer';
import Circle from '../../circlepacker/Circle';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import useKeywordListQuery from '@hooks/useKeywordListQuery';
import styles from '@sass/components/community/KeywordBubbleChart.module.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const KeywordBubbleChart = () => {
  const router = useRouter();
  const communityId: string = router.query.id as string;
  const [bubbleDataList, setBubbleDataList] = useState<BubbleData[]>([]);
  const [_, setIsMove] = useState<boolean>(false);
  const requestAnimationId = useRef<NodeJS.Timer | null>(null);
  const circleContainerRef = useRef<CircleContainer | null>(null);
  const fetchedKeywordData = useKeywordListQuery(communityId);
  // 여기에서는 slice된 keywordData를 가지고 있기 때문에 fetched와 별도의 상태로 관리됨.
  const [slicedCommunityKeywordData, setSlicedCommunityKeywordData] = useState<
    KeywordData[]
  >([]);

  const getBubbleData = (keywordData: KeywordData, circleData: Circle) => {
    return {
      keyword: keywordData.keywordName,
      count: keywordData.memberCount,
      circle: circleData,
    };
  };

  // TODO: 애니메이션 setInrevl로 할지 requestAnimationFrame으로 할지 정해서  변수명 정하고 update 함수 리팩토링하기
  // circleContainer가 아닌 이곳에 있는 이유는, 이 함수는 연산보다는 렌더링에 가까운 로직이기 때문 (setIsMove를 토글하여 리렌더링 시킴)
  const animate = () => {
    const update = () => {
      if (circleContainerRef.current?.isStatic) {
        clearInterval(requestAnimationId.current!);
        return;
      }

      setIsMove((prev) => !prev);
      circleContainerRef.current?.update();
    };

    requestAnimationId.current = setInterval(() => {
      update();
    }, 300);
  };

  useEffect(() => {
    if (!fetchedKeywordData) {
      return;
    }
    const slicedData = fetchedKeywordData.slice(0, 30);
    setSlicedCommunityKeywordData(slicedData);
  }, [fetchedKeywordData]);

  useEffect(() => {
    if (!circleContainerRef.current) {
      circleContainerRef.current = new CircleContainer(
        window.innerWidth,
        window.innerHeight,
      );
    }

    const bubbleDataArray = slicedCommunityKeywordData.map((keywordData) => {
      const radius = 20 + keywordData.memberCount * 2;
      const circleData = circleContainerRef.current!.addCircle(
        keywordData.keywordId,
        radius,
        keywordData.keywordName,
      );

      return getBubbleData(keywordData, circleData);
    });

    setBubbleDataList(bubbleDataArray);
  }, [slicedCommunityKeywordData]);

  useEffect(() => {
    if (bubbleDataList.length) {
      animate();
    }
    // 매번 이전 interval을 지우고 새로운 interval로 교체되며 움직임이 빨라지지 않음.
    return () => {
      clearInterval(requestAnimationId.current!);
    };
  }, [bubbleDataList]);

  return (
    <div className={cx('chart-container')}>
      {bubbleDataList.map((bubbleData, index) => (
        <KeywordBubble
          key={index}
          keyword={bubbleData.keyword}
          posX={bubbleData.circle.x}
          posY={bubbleData.circle.y}
          radius={bubbleData.circle.radius}
        />
      ))}
    </div>
  );
};

export default KeywordBubbleChart;

export const getServerSideProps = async ({ query }: NextPageContext) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['keyword', query.id]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
