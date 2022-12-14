import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apis } from '@apis/index';
import { LoginModalContent, Modal } from '@components/common';
import SeoHead from '@components/common/Head';
import {
  HomeChevronDown,
  HomeHero,
  HomeLayout,
  HomeMainLayout,
  HomeTitle,
} from '@components/home';
import HomeDescription from '@components/home/HomeDescription';
import StartButton from '@components/home/StartButton';
import { MVP_DEFAULT } from '@constants/constants';
import useUserMe from '@hooks/useUserMe';
import config from '../config';

const Home = () => {
  const router = useRouter();
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
  const userData = useUserMe();

  const openLoginModal = () => {
    setIsOpenLoginModal(true);
  };

  useEffect(() => {
    // try / catch로 depth가 깊어져서 ealry return 사용
    if (!userData || !router.isReady) {
      return;
    }

    try {
      apis.user.joinCommunity(MVP_DEFAULT.COMMUNITY_ID);
    } catch (e) {
      alert('알 수 없는 에러가 발생했습니다.');
    }

    router.push('/main');
  }, [userData, router]);

  return (
    <HomeLayout>
      <SeoHead
        title='와글와글 | 홈'
        description='데이터 시각화를 통한 중규모 커뮤니티 소모임 관리 서비스'
        url={`${config.HOST}${router.asPath}`}
      />
      <HomeMainLayout>
        <HomeTitle />
        <HomeHero />
        <StartButton handleClick={openLoginModal} />
        <HomeChevronDown />
      </HomeMainLayout>
      <HomeDescription />
      <Modal
        isOpenModal={isOpenLoginModal}
        closeModal={() => setIsOpenLoginModal(false)}
      >
        <LoginModalContent />
      </Modal>
    </HomeLayout>
  );
};

export default Home;
