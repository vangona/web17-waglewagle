import { Author, ThreadData } from '#types/types';
import { useDeleteThreadMutation } from '@hooks/thread';
import useUserMe from '@hooks/useUserMe';
import CommentIcon from '@public/images/icons/comment.svg';
import DeleteIcon from '@public/images/icons/delete.svg';
import styles from '@sass/components/community/keyword-group/Thread.module.scss';
import calculateTimeGap from '@utils/calculateTimeGap';
import classnames from 'classnames/bind';
import Image from 'next/image';
const cx = classnames.bind(styles);

interface ThreadProps {
  threadId: string;
  content: string;
  childThreadCount: number;
  childThreads: ThreadData[];
  createdAt: string;
  updatedAt: string;
  author: Author;
  openSidebar(threadId: string): void;
}

const Thread = ({
  threadId,
  content,
  createdAt,
  author: { userId, username, profileImageUrl },
  openSidebar,
}: ThreadProps) => {
  const userData = useUserMe();
  const { mutate: deleteThread } = useDeleteThreadMutation();

  return (
    <li className={cx('thread')}>
      <Image
        className={cx('profile-image')}
        src={
          profileImageUrl === null
            ? '/images/default-profile.png'
            : profileImageUrl
        }
        alt='프로필 이미지'
        width={30}
        height={30}
      />
      <div>
        <div className={cx('name-time')}>
          <p>{username}</p>
          <p className={cx('post-time')}>{calculateTimeGap(createdAt)}</p>
        </div>
        <p>{content}</p>
      </div>
      <div className={cx('buttons')}>
        <button
          className={cx('comment-button')}
          onClick={() => openSidebar(threadId)}
        >
          <CommentIcon />
        </button>
        {userId === userData?.userId && (
          <button
            className={cx('delete-button')}
            onClick={() => deleteThread(threadId)}
          >
            <DeleteIcon />
          </button>
        )}
      </div>
    </li>
  );
};

export default Thread;
