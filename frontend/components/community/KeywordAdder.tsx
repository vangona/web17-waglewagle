import {
  MouseEventHandler,
  ChangeEventHandler,
  FormEventHandler,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import useAutoComplete from '@hooks/useAutoComplete';
import {
  SearchResultListLayout,
  AutoCompleteFormLayout,
} from '@components/community';
import styles from '@sass/components/community/KeywordAdderLayout.module.scss';
import classnames from 'classnames/bind';
import useKeywordListQuery from '@hooks/useKeywordListQuery';
const cx = classnames.bind(styles);

interface KeywordAdderProps {
  theme: string;
  addButtonValue: React.ReactNode | string;
}

const KeywordAdder = ({ theme, addButtonValue }: KeywordAdderProps) => {
  const router = useRouter();
  const communityId: string = router.query.id as string;
  const communityKeywordData = useKeywordListQuery(communityId);
  const {
    searchKeyword,
    searchResult,
    changeSearchKeyword,
    updateSearchResult,
  } = useAutoComplete(communityKeywordData);

  // TODO: 자동완성 컴포넌트 추상화하면서 거기로 넘기기
  const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsOpenDropDown(true);
    updateSearchResult();
  };

  const handleChangeSearchKeyword: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    changeSearchKeyword(e.target.value);
  };

  const handleMouseDownkResultItem: MouseEventHandler<HTMLLIElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLLIElement;
    changeSearchKeyword(target.innerText);
  };

  return (
    <div
      className={cx(theme)}
      onFocus={() => setIsOpenDropDown(true)}
      onBlur={() => setIsOpenDropDown(false)}
    >
      {isOpenDropdown && (
        <SearchResultListLayout layoutTheme={theme}>
          {searchResult.map((word, index) => (
            <li onMouseDown={handleMouseDownkResultItem} key={index}>
              {word}
            </li>
          ))}
        </SearchResultListLayout>
      )}
      <AutoCompleteFormLayout layoutTheme={theme} handleSubmit={handleSubmit}>
        <input
          type='text'
          value={searchKeyword}
          onChange={handleChangeSearchKeyword}
        />
        <button type='submit'>{addButtonValue}</button>
      </AutoCompleteFormLayout>
    </div>
  );
};

export default KeywordAdder;
