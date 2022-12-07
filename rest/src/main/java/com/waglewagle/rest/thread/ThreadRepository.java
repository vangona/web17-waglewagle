package com.waglewagle.rest.thread;


import com.waglewagle.rest.thread.ThreadDTO.*;
import lombok.RequiredArgsConstructor;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {

    void deleteAllByParentThreadId(Long parentThreadId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Thread  t SET t.keyword.id = ?2 WHERE t.keyword.id IN ?1")
    //TODO: 배치 사이즈 정할 수 있는 것처럼, 벌크 연산에 있어 사이즈 조절이 가능할까?
    int updateAllKeywordIdByIdInBulk(List<Long> srcIdList, Long desId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Thread th WHERE th.keyword.id IN ?1 AND th.parentThread IS NULL")
    int deleteAllParentThreadByKeywordIdInBulk(List<Long> keywordIdList);

    List<Thread> findThreadsByParentThreadIsNullAndKeywordId(Long keywordId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Thread th WHERE th.keyword.id IN ?1 AND th.parentThread IS NOT NULL")
    int deleteAllChildThreadByKeywordIdInBulk(List<Long> keywordIdList);


}
