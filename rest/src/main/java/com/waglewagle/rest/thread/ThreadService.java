package com.waglewagle.rest.thread;

import com.waglewagle.rest.keyword.Keyword;
import com.waglewagle.rest.keyword.KeywordRepository;
import com.waglewagle.rest.thread.ThreadDTO.CreateThreadDTO;
import com.waglewagle.rest.thread.ThreadDTO.CreateThreadInputDTO;
import com.waglewagle.rest.thread.ThreadDTO.ThreadResponseDTO;
import com.waglewagle.rest.user.User;
import com.waglewagle.rest.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.waglewagle.rest.thread.ThreadDTO.CreateThreadDTO.createCreateThreadDTO;

@Service
@RequiredArgsConstructor
public class ThreadService {

    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final KeywordRepository keywordRepository;

    @Transactional
    public Thread creatThread(Long userId, CreateThreadInputDTO createThreadInputDTO) {

        Long parentThreadId = createThreadInputDTO.getParentThreadId();
        Thread parentThread = null;
        if (parentThreadId != null && threadRepository.findById(parentThreadId).filter(pt -> pt.getParentThread() != null).isPresent()) {
            // 자식의 자식임.
            // 안 만들어 줘야 한다.
            return null;
        }
        if (parentThreadId != null && threadRepository.findById(parentThreadId).filter(pt -> pt.getParentThread() == null).isPresent()) {
            parentThread = threadRepository.findById(parentThreadId).filter(pt -> pt.getParentThread() == null).get();
        }

        User author = userRepository.findById(userId);
        Keyword keyword = keywordRepository.findOne(createThreadInputDTO.getKeywordId());
        String content = createThreadInputDTO.getContent();

        //TODO: java Optional 문법!
        CreateThreadDTO createThreadDTO = createCreateThreadDTO(author, parentThread, keyword, content);

        return threadRepository.save(new Thread(createThreadDTO));
    }

    @Transactional
    public void deleteThread(Long userId, Long threadId) {

        Optional<Thread> thread = threadRepository.findById(threadId);

        if (thread.isEmpty()) {
            return; //TODO: 예외 혹은 제대로된 리턴
        }

        if (!Objects.equals(thread.get().getAuthor().getId(), userId)) {
            return; //TODO: 예외 혹은 제대로된 리턴
        }

        threadRepository.deleteAllByParentThreadId(threadId); //TODO: 아직 동작 확인 못함(테스트코드)
        threadRepository.deleteById(threadId);
    }

    @Transactional
    public List<ThreadResponseDTO> getThreadsInKeyword(Long keywordId) {
        List<Thread> threads = threadRepository.findThreadsByParentThreadIsNullAndKeywordId(keywordId);
        return threads
                .stream()
                .map(ThreadResponseDTO::of)
                .collect(Collectors.toList());
    }
}
