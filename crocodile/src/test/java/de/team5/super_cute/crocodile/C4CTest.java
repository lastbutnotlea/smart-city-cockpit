package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.AppointmentInvolvedParties;
import de.team5.super_cute.crocodile.model.C4CEntity;
import de.team5.super_cute.crocodile.model.C4CNotes;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.olingo.odata2.api.batch.BatchException;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.junit.Assert;
import org.junit.Test;

public class C4CTest {

  @Test
  public void testAppointments() {
    List<AppointmentInvolvedParties> aip = new ArrayList<AppointmentInvolvedParties>() {{
      add(new AppointmentInvolvedParties("Fussballclub"));
    }};
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("There are gonna be many many people", C4CNotes.APPOINTMENT_NOTES_TYPE_CODE));
    }};
    testC4CEntity(
        new Event("Fussballspiel", "3", LocalDateTime.now(), LocalDateTime.now().plusHours(1),
            "Fussballarena", aip, notes));
  }

  @Test
  public void testServiceRequests() {
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", C4CNotes.SERVICE_REQUEST_DESCRIPTION_TYPE_CODE));
    }};
    testC4CEntity(
        new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(), "3", "1", LocalDateTime.now().plusDays(5),
            EServiceType.MAINTENANCE, notes, "Vehicle_0", "Feedback_0"));
    //todo change type to cleaning if respecitive code was created by mhp
  }

  private void testC4CEntity(C4CEntity entity) {
    try {
      SAPC4CConnector connector = new SAPC4CConnector();
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

      Assert.assertTrue(!connector.getC4CEntities(entity.getEmptyObject()).contains(entity));

    } catch (EntityProviderException | IOException | BatchException | EdmException e) {
      e.printStackTrace();
      Assert.fail("Exception was thrown: " + e.getMessage());
    }
  }

}
