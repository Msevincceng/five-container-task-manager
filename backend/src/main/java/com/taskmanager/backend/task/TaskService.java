package com.taskmanager.backend.task;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Cacheable(value = "tasks", key = "'all'")
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @CacheEvict(value = "tasks", allEntries = true)
    public Task create(Task task) {
        return taskRepository.save(task);
    }

    @CacheEvict(value = "tasks", allEntries = true)
    public Task toggle(Long id) {
        Task task = findById(id);
        task.toggleCompleted();

        return taskRepository.save(task);
    }

    @CacheEvict(value = "tasks", allEntries = true)
    public void delete(Long id) {
        Task task = findById(id);
        taskRepository.delete(task);
    }

    private Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Görev bulunamadı"
                ));
    }
}
