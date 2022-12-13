import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AddCircleIcon from '@public/images/icons/add-circle.svg';
import { apis } from '@apis/index';
import useUserMe from '@hooks/useUserMe';
import { KeywordGroupData, MyKeywordData } from '#types/types';
import { KEYWORD_ADDER_THEME, MVP_DEFAULT } from '@constants/constants';
import config from '../../config';
import SeoHead from '@components/common/Head';
import { Loading, Modal } from '@components/common';
import { CommunityHeader, CommunityLayout } from '@components/community';
import { KeywordGroupModalContent } from '@components/community/keyword-group';
import { KeywordAdderContent } from '@components/community/keyword-adder';
import { MainKeywordHandlerLayout } from '@components/community';
import { KeywordBubbleChart } from '@components/community/keyword-bubble-chart';
import MyKeywordHighlight from '@components/community/MyKeywordHighlight';
import CommunityKeywordList from '@components/community/CommunityKeywordList';

const LoginModalContent = dynamic(
  () => import('@components/common/LoginModalContent'),
  {
    loading: () => <Loading />,
  },
);

const KeywordAddModalContent = dynamic(
  () =>
    import(
      '../../components/community/keyword-add-modal/KeywordAddModalContent'
    ),
  {
    loading: () => <Loading />,
  },
);

const Community = () => {
  const router = useRouter();
  const communityId = router.query.id as string;

  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
  const [isOpenKeywordModal, setIsOpenKeywordModal] = useState<boolean>(false);
  const [isMyKeywordHighlight, setIsMyKeywordHighlight] =
    useState<boolean>(false);
  const [isOpenKeywordGroupModal, setIsOpenKeywordGroupModal] =
    useState<boolean>(false);
  const [prevKeyword, setPrevKeyword] = useState<MyKeywordData>();
  const [keywordGroupData, setKeywordGroupData] = useState<KeywordGroupData>();

  const userData = useUserMe(communityId);

  const handleChangePrevKeyword = (newPrevKeyword: MyKeywordData) => {
    setPrevKeyword(newPrevKeyword);
  };

  const handleChangeKeywordGroupData = (
    newKeywordGroupData: KeywordGroupData,
  ) => {
    setIsOpenKeywordGroupModal(true);
    setKeywordGroupData(newKeywordGroupData);
  };

  const handleClickEnter = () => {
    setIsOpenLoginModal(true);
  };

  const handleClickKeywordModal = () => {
    setIsOpenKeywordModal(true);
  };

  const closeKeywordModal = () => {
    setIsOpenKeywordModal(false);
  };

  const toggleIsMyKeywordHighlight = () => {
    setIsMyKeywordHighlight((prev) => !prev);
  };

  useEffect(() => {
    // try / catch로 depth가 깊어져서 ealry return 사용
    if (!userData) {
      return;
    }

    const interval = setInterval(() => {
      apis.user.updateLastActivity();
    }, 60000);

    try {
      apis.user.joinCommunity(MVP_DEFAULT.COMMUNITY_ID);
    } catch (e) {
      alert('알 수 없는 에러가 발생했습니다.');
    }

    return () => {
      clearInterval(interval);
    };
  }, [userData]);

  useEffect(() => {
    if (userData?.isFirstInCommunity) {
      setIsOpenKeywordModal(true);
    }
  }, [userData?.isFirstInCommunity]);

  return (
    <CommunityLayout>
      <SeoHead
        title='와글와글 | 부스트캠프 7기'
        description='데이터 시각화를 통한 중규모 커뮤니티 소모임 관리 서비스'
        url={`${config.HOST}${router.asPath}`}
      />
      <CommunityHeader
        title='부스트캠프 7기'
        handleClickKeywordModal={handleClickKeywordModal}
        handleClickEnter={handleClickEnter}
      />
      <CommunityKeywordList />
      <KeywordBubbleChart
        isMyKeywordHighlight={isMyKeywordHighlight}
        handleChangeKeywordGroupData={handleChangeKeywordGroupData}
      />
      {userData && (
        <MainKeywordHandlerLayout>
          <KeywordAdderContent
            theme={KEYWORD_ADDER_THEME.MAIN}
            addButtonValue={<AddCircleIcon />}
            handleChangePrevKeyword={handleChangePrevKeyword}
          />
          <MyKeywordHighlight
            toggleIsMyKeywordHighlight={toggleIsMyKeywordHighlight}
          />
        </MainKeywordHandlerLayout>
      )}
      <Modal
        isOpenModal={isOpenLoginModal}
        closeModal={() => setIsOpenLoginModal(false)}
      >
        <LoginModalContent />
      </Modal>
      <Modal
        isOpenModal={isOpenKeywordModal}
        closeModal={() => setIsOpenKeywordModal(false)}
      >
        <KeywordAddModalContent
          prevKeyword={prevKeyword}
          handleChangePrevKeyword={handleChangePrevKeyword}
          closeKeywordModal={closeKeywordModal}
        />
      </Modal>
      <Modal
        isOpenModal={isOpenKeywordGroupModal}
        closeModal={() => setIsOpenKeywordGroupModal(false)}
      >
        {keywordGroupData && (
          <KeywordGroupModalContent
            keywordId={keywordGroupData.keywordId}
            keyword={keywordGroupData.keyword}
          />
        )}
      </Modal>
    </CommunityLayout>
  );
};

export default Community;
