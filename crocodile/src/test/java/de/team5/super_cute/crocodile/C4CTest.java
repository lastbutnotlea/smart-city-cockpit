package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.c4c.AppointmentInvolvedParties;
import de.team5.super_cute.crocodile.model.c4c.C4CEntity;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.olingo.odata2.api.batch.BatchException;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "app.scheduling.enable=false")
public class C4CTest {

  @Autowired
  private SAPC4CConnector connector;

  @Test
  public void testEvents() {
    List<AppointmentInvolvedParties> aip = new ArrayList<AppointmentInvolvedParties>() {{
      add(new AppointmentInvolvedParties("Fussballclub"));
    }};
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("There are gonna be many many people", EC4CNotesTypeCode.APPOINTMENT_NOTES));
    }};
    testC4CEntity(
        new Event("Fussballspiel", EState.FINE, LocalDateTime.now(), LocalDateTime.now().plusHours(1),
            "Fussballarena", aip, notes));
  }

  @Test
  public void testServiceRequests() {
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
    }};
    testC4CEntity(
        new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(), EState.FINE, LocalDateTime.now().plusDays(5),
            EServiceType.MAINTENANCE, notes, "Vehicle_0", "Feedback_0"));
    //todo change type to cleaning if respecitive code was created by mhp
  }

  private void testC4CEntity(C4CEntity entity) {
    try {
      if (connector.getC4CEntities(entity.getEmptyObject()).contains(entity)) {
        Assert.fail(
            "Test " + entity.getClass() + "\n" + entity + "\n is already present in " + entity
                .getCollectionName());
      }
      connector.putC4CEntity(entity);
      List<C4CEntity> entities = connector.getC4CEntities(entity.getEmptyObject());
      Assert.assertTrue(entities.contains(entity));

      List<C4CEntity> objects = connector.getC4CEntities(entity.getEmptyObject());
      C4CEntity entityWithObjectId = objects.get(objects.indexOf(entity));
      connector.deleteC4CEntity(entityWithObjectId);

      List<C4CEntity> entitiesAfterDeletion = connector.getC4CEntities(entity.getEmptyObject());
      Assert.assertTrue(!entitiesAfterDeletion.contains(entity));

    } catch (EntityProviderException | IOException | BatchException | EdmException e) {
      e.printStackTrace();
      Assert.fail("Exception was thrown: " + e.getMessage());
    }
  }

}
