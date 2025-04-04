
package com.projectstack.api.repository;
import org.springframework.lang.NonNull; 
import com.projectstack.api.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    @Query("{ 'members.id': ?0 }")
    List<Project> findByMemberId(String userId);
    void deleteById(@NonNull String id);

}
