package com.waglewagle.rest.keywordUser;

import com.waglewagle.rest.community.Community;
import com.waglewagle.rest.keyword.Keyword;
import com.waglewagle.rest.keyword.KeywordDTO.*;
import com.waglewagle.rest.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class KeywordUser {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id")
    private Keyword keyword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    public KeywordUser(JoinKeywordDTO joinKeywordDTO) {
        community = joinKeywordDTO.getCommunity();
        keyword = joinKeywordDTO.getKeyword();
        user = joinKeywordDTO.getUser();
    }
}
